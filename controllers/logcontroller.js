const router = require("express").Router()
const { LogModel } = require("../models")
const { validateSession } = require("../middleware");
const Log = require("../models/log");

router.post('/create', async (req, res) => {
    const { description, definition, result } = req.body;
    const { id } = req.user;
    const workoutLog = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(workoutLog)
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get("/owner", async (req, res) => {
    let { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get("/:id", async (req, res) => {
    // const { id } = req.params;
    try {
        const results = await LogModel.findOne({
            where: {
                owner_id: req.user.id,
                id: req.params.id
            }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err})
    }
});

router.put("/update/:entryId", async (req, res) => {
    const { description, definition, result } = req.body;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const search = {
        where: {
            id: logId,
            owner_id: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result,
    };

    try {
        const update = await LogModel.update(updatedLog, search);
        res.status(200).json({ message: `Updated ${update} log`});
    } catch (err) {
        res.status(500).json({ error: err })
    };
});

router.delete("/delete/:id", async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const search = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };
        await LogModel.destroy(search);
        res.status(200).json({ message: "Log Entry Removed"});
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

module.exports = router