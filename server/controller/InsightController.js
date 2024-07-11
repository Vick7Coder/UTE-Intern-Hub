import Insight from "../models/insightModel.js";

// Tạo insight mới
export const createInsight = async (req, res) => {
    try {

        const { title, content } = req.body;
        const admin = req.user.userId; // Lấy ID của người viết insight từ đăng nhập

        const newInsight = new Insight({
            title,
            content,
            admin,
        });

        await newInsight.save();
        res.status(201).json({ message: "Insight created successfully", insight: newInsight });
    } catch (error) {
        res.status(500).json({ message: "Error creating insight", error });
    }
};

// Cập nhật insight
export const updateInsight = async (req, res) => {
    try {
        const { insightId } = req.params;
        const { title, content } = req.body;

        const updatedInsight = await Insight.findByIdAndUpdate(
            insightId,
            { title, content },
            { new: true }
        );

        if (!updatedInsight) {
            return res.status(404).json({ message: "Insight not found" });
        }

        res.status(200).json({ message: "Insight updated successfully", insight: updatedInsight });
    } catch (error) {
        res.status(500).json({ message: "Error updating insight", error });
    }
};

// Lấy thông tin insight theo ID
export const getInsightById = async (req, res) => {
    try {
        const { id } = req.params;

        const insight = await Insight.findById(id).populate('admin', 'name email');

        if (!insight) {
            return res.status(404).json({ message: "Insight not found" });
        }

        res.status(200).json(insight);
    } catch (error) {
        res.status(500).json({ message: "Error fetching insight", error });
    }
};

// Lấy danh sách insight
export const getInsightPosts = async (req, res) => {
    try {
        const { search, sort } = req.query;

        let queryObject = {};

        if (search) {
            queryObject = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } },
                ],
            };
        }

        let queryResult = Insight.find(queryObject).populate('admin', 'name email');

        // SORTING
        if (sort === "Newest") {
            queryResult = queryResult.sort("-createdAt");
        }
        if (sort === "Oldest") {
            queryResult = queryResult.sort("createdAt");
        }
        if (sort === "A-Z") {
            queryResult = queryResult.sort("title");
        }
        if (sort === "Z-A") {
            queryResult = queryResult.sort("-title");
        }

        // pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;

        const totalInsights = await Insight.countDocuments(queryResult);
        const numOfPage = Math.ceil(totalInsights / limit);

        queryResult = queryResult.skip((page - 1) * limit).limit(limit);

        const insights = await queryResult;

        res.status(200).json({
            success: true,
            totalInsights,
            data: insights,
            page,
            numOfPage,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching insights", error });
    }
};

export const deleteInsightPost = async (req, res) => {
    try {
        const { insightId } = req.params;
        const userId = req.user.userId; // Get the logged-in user's ID

        // Find the insight to check the author
        const insight = await Insight.findById(insightId);
        if (!insight) {
            return res.status(404).json({ message: "Insight not found" });
        }

        // Check if the logged-in user is the author
        if (insight.admin.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this insight" });
        }

        // Delete the insight
        await Insight.findByIdAndDelete(insightId);
        res.status(200).json({ message: "Insight deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting insight", error });
    }
};
