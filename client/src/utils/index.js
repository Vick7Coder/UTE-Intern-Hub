import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
    baseURL: API_URL,
    responseType: 'json',
})

export const apiRequest = async ({ url, token, data, method }) => {
    try {

        const result = await API(url, {
            method: method || "GET ",
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : ""
            }

        })
        return result;

    }
    catch (error) {

        return error?.response?.data;


    }
}

export const handleFileUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
            formData
        )
        return response.data.secure_url;
    }
    catch (error) {
        console.log(error)
    }
}

export const updateURl = ({
    pageNum,
    query,
    cmpLoc,
    sort,
    navigate,
    location,
    jType,
    exp }
) => {

    const params = new URLSearchParams();

    if (pageNum && pageNum > 1) {
        params.set("page", pageNum)
    }

    if (query) {
        params.set("search", query)
    }
    if (cmpLoc) {
        params.set("location", cmpLoc)
    }
    if (sort) {
        params.set("sort", sort)
    }
    if (jType) {
        params.set("jtype", jType)
    }
    if (exp) {
        params.set("exp", exp)
    }

    const newURL = `${location.pathname}?${params.toString()}`
    navigate(newURL, { replace: true })

    return newURL;

}

export const updateURlinsight = ({
    pageNum,
    query,
    sort,
    navigate,
    location,
}) => {
    const params = new URLSearchParams();

    if (pageNum && pageNum > 1) {
        params.set("page", pageNum);
    }
    if (query) {
        params.set("search", query);
    }
    if (sort) {
        params.set("sort", sort);
    }

    // Chỉ lấy phần query string, không bao gồm pathname
    const newURL = params.toString() ? `?${params.toString()}` : '';

    // Cập nhật URL mà không thay đổi pathname
    navigate(`${location.pathname}${newURL}`, { replace: true });

    return newURL;
};