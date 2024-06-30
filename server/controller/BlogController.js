import Blog from "../models/blogModel.js";

// Tạo blog mới
export const createBlog = async (req, res) => {
    try {

        const { title, content } = req.body;
        const recruiter = req.user.userId; // Lấy ID của người viết blog từ đăng nhập

        const newBlog = new Blog({
            title,
            content,
            recruiter,
        });

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: "Error creating blog", error });
    }
};

// Cập nhật blog
export const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, content },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Error updating blog", error });
    }
};


// Lấy thông tin blog theo ID
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id).populate('recruiter', 'name email');

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog", error });
    }
};

// Lấy danh sách blog
export const getBlogPosts = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('recruiter', 'name email');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
};

export const deleteBlogPost = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.userId; // Get the logged-in user's ID

        // Find the blog to check the author
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the logged-in user is the author
        if (blog.recruiter.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this blog" });
        }

        // Delete the blog
        await Blog.findByIdAndDelete(blogId);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    }
};
