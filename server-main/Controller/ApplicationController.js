const ApplicationModel = require("../Model/ApplicationModel");
const mongoose = require("mongoose");
const createError = require("http-errors");
const UserModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const { bucket } = require("../Firebase/firebaseConfig");
const day = require("dayjs");

exports.testing = async (req, res, next) => {
    try {
        res.status(200).json({
            status: "Ok",
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

module.exports.getCandidateAppliedJobs = async (req, res, next) => {
    try {
        const filters = { ...req.query, applicantId: req.user._id }; // faire une copie pour que l'original ne soit pas moidifié
        console.log(filters);
        // exclude
        const excludeFields = ["sort", "page", "limit", "fields", "search"];
        excludeFields.forEach((field) => delete filters[field]);

        const queries = {};

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            queries.sortBy = sortBy;
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            queries.fields = fields;
        }
        if (req.query.limit) {
            const limit = req.query.limit.split(",").join(" ");
            queries.limit = limit;
        }

        if (req.query.page) {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 5);
            const skip = (page - 1) * limit;

            queries.skip = skip;
            queries.limit = limit;
            queries.page = page;
        }

        const { result, totalJobs, pageCount, page } = await getData(
            filters,
            queries
        );

        // response
        if (result.length !== 0) {
            res.status(200).json({
                status: true,
                result,
                totalJobs,
                currentPage: page,
                pageCount: pageCount || 1,
            });
        } else {
            next(createError(500, "Job List is empty"));
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

const getData = async (filters, queries) => {
    let sortCriteria = {};

    if (queries.sortBy) {
        switch (queries.sortBy) {
            case "newest":
                sortCriteria = { createdAt: -1 };
                break;
            case "oldest":
                sortCriteria = { createdAt: 1 };
                break;
            case "a-z":
                sortCriteria = { position: 1 };
                break;
            case "z-a":
                sortCriteria = { position: -1 };
                break;
            default:
                // Default sorting criteria si aucune des options ne correspond
                sortCriteria = { createdAt: -1 };
                break;
        }
    } else {
        // Default sorting criteria si le paramètre sortBy n'est pas fourni
        sortCriteria = { createdAt: -1 };
    }
    const result = await ApplicationModel.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(sortCriteria)
        .select(queries.fields)
        .populate("jobId");

    // il ne dépend pas du précédent, son numéro de document sera basé sur le filtre passé ici
    const totalJobs = await ApplicationModel.countDocuments(filters);
    const pageCount = Math.ceil(totalJobs / queries.limit);
    return { result, totalJobs, pageCount, page: queries.page };
};

module.exports.getRecruiterPostJobs = async (req, res, next) => {
    const filter = { recruiterId: req.user._id };
    try {
        const result = await ApplicationModel.find(filter).populate("jobId");
        const totalJobs = await ApplicationModel.countDocuments(filter);
        // response
        if (result.length !== 0) {
            res.status(200).json({
                status: true,
                totalJobs,
                result,
            });
        } else {
            next(createError(500, "No Job Found"));
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.applyInJob = async (req, res, next) => {
    try {
        // Vérifie si l'utilisateur a déjà appliqué pour ce travail
        const alreadyApplied = await ApplicationModel.findOne({
            applicantId: req.body.applicantId,
            jobId: req.body.jobId,
        });

        if (alreadyApplied) {
            return next(createError(400, "You have already applied for this job."));
        }

        // Crée une nouvelle instance d'application
        const newApplication = new ApplicationModel(req.body);

        // Enregistre l'application dans la base de données
        const savedApplication = await newApplication.save();

        // Répond avec succès
        res.status(201).json({
            status: true,
            message: "Applied Successfully",
            application: savedApplication,
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};


exports.applyForGuest = async (req, res, next) => {
    try {
        const { username, email, jobId } = req.body;
        const resumeFile = req.file; // Assurez-vous que multer est configuré pour gérer les fichiers

        // Vérifie si l'e-mail existe déjà dans la base de données
        const existingUser = await UserModel.findOne({ email });

        let savedUser;
        if (existingUser) {
            // Si l'utilisateur existe déjà, utilisez cet utilisateur
            savedUser = existingUser;
        } else {
            // Crée un nouvel utilisateur guest s'il n'existe pas encore
            const password = 'passwordGuest';
            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new UserModel({
                username: username,
                email,
                password: hashedPassword,
                role: 'guest',
                resume: '', // Initialiser avec une chaîne vide pour éviter les erreurs si le fichier est absent
            });

            savedUser = await newUser.save();
        }

        // Récupère l'ID de l'utilisateur guest
        const applicantId = savedUser._id;

        // Vérifie si l'utilisateur a déjà appliqué pour ce travail
        const alreadyApplied = await ApplicationModel.findOne({
            applicantId: applicantId,
            jobId: jobId,
        });

        if (alreadyApplied) {
            return next(createError(400, "You have already applied for this job."));
        }

        // Télécharge le fichier de CV dans Firebase Storage
        const blob = bucket.file(`resumes/${Date.now()}_${resumeFile.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: resumeFile.mimetype,
            },
        });

        blobStream.on("error", (err) => {
            console.error("Blob stream error:", err);
            next(createError(500, "Something went wrong with the upload."));
        });

        blobStream.on("finish", async () => {
            // Rendre le fichier accessible publiquement
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // URL publique du fichier

            // Mettre à jour l'utilisateur avec l'URL du CV
            savedUser.resume = publicUrl;
            await savedUser.save(); // Enregistrer l'URL dans MongoDB

            // Créer une nouvelle instance d'application avec l'ID de l'utilisateur guest
            const newApplication = new ApplicationModel({
                ...req.body,
                applicantId: applicantId,
                resume: publicUrl, // Ajoutez l'URL du CV à l'application
            });

            // Enregistre l'application dans la base de données
            const savedApplication = await newApplication.save();

            // Répond avec succès
            res.status(201).json({
                status: true,
                message: "Applied Successfully",
                application: savedApplication,
            });
        });

        blobStream.end(resumeFile.buffer); // Écrire le contenu du fichier dans Firebase Storage
    } catch (error) {
        next(createError(500, error.message));
    }
};
module.exports.updateJobStatus = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    try {
        if (data?.recruiterId?.toString() === req?.user._id.toString()) {
            console.log("same");
            if (!mongoose.Types.ObjectId.isValid(id)) {
                next(createError(400, "Invalid Job ID format"));
            }

            const isJobExists = await ApplicationModel.findOne({ _id: id });
            if (!isJobExists) {
                next(createError(500, "Job not found"));
            } else {
                const updatedJob = await ApplicationModel.findByIdAndUpdate(
                    id,
                    { $set: data },
                    {
                        new: true,
                    }
                );
                res.status(200).json({
                    status: true,
                    message: "Job Updated",
                    result: updatedJob,
                });
            }
        } else {
            next(createError(400, "Unauthorized user to update job"));
        }
    } catch (error) {
        next(createError(500, `something wrong: ${error.message}`));
    }
};
