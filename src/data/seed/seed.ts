import { envs } from "../../config";
import { CategoryModel, Mongodatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";



(async () => {
    await Mongodatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await main();


    await Mongodatabase.disconnect();



})();

const randomBetween0andX = (x: number) => {
    return Math.floor(Math.random() * x);
}


async function main() {

    //? Borrar todo!!!

    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()

    ]);

    // * Crear usuarios

    const users = await UserModel.insertMany(seedData.users);

    //* Crear categoria

    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category => {
            return {
                ...category,
                user: users[0]._id
            }
        })

    );



    //? Crear productos

    const products = await ProductModel.insertMany(
        seedData.products.map(product =>{
            return {
                ...product,
                user: users[randomBetween0andX(users.length -1)]._id,
                category: categories[randomBetween0andX(categories.length -1)]._id
            }
        } )
    );

    console.log('SEEDED');

}