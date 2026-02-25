import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import User from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
    //check user detail from frontend
    //validation not empty
    // check if user already exists
    // chech for images
    // check fro avatar
    // upload them to cloudinary,avatar
    // creae user object - create etry in db
    // remove passowrd and refresh token field
    // check for user creation
    // return response

    const {fullName, email, username, password} = req.body
    
    if ([fullName,username,email,password].some((field) => {
        return field?.trim() === ""
    })){
        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username } , { email }] // finds the first object in users database that matches email or username
    })

    if(existedUser){
        throw new ApiError(409 , "User with emial or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    console.log(req.files?.avatar[0].path)
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400 , "Avatar file is required");
    }
    


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage.url?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const CreatedUser = await user.findById(user._id).select(
        "-password -refreshToken"
    ) // we created this user to remove the refresh token and password

    if(!CreatedUser){
        throw new ApiError(400 , "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , CreatedUser , "Userregistered successfully")
    )
})

export { registerUser }


