import { model, Schema } from "mongoose";
import mongoosePaginatev2 from "mongoose-paginate-v2";


const productCollection = "Products Shop"
const productSchema = new Schema({

    // id: String,
    title: String,
    description: String,
    code: {
        type: String,
        unique: true
    },
    price:{
        type:Number,
        require: true
    },
    stock:{ 
        type: Number, 
        require: true 
    },
    category: String,
    status: Boolean,
})
productSchema.plugin(mongoosePaginatev2)

export const productModel = model (productCollection, productSchema)


 
