import mongoose, { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

 
const productCollection = "Products Shop"
const productSchema = new Schema({

    // id: String,
    title: String,
    description: String,
    code: {
        type: String,
        unique: true
    },
    price: Number,
    stock:{ 
        type: Number, 
        require: true 
    },
    category: String,
    status: Boolean,
    // thumbnail: String,
})
productSchema.plugin(mongoosePaginate)

export const ProductModel = mongoose.model(productCollection, productSchema)

 
