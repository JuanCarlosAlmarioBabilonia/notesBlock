import mongoose from "mongoose";

class Database {
  constructor() {
    this.connection();
  }

  async connection() {
    try {
      await mongoose.connect(`${process.env.MONGO_PROTOCOL}${process.env.MONGO_USER}:${process.env.MONGO_PSW}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`);
      console.log("Conectado correctamente a la base de datos");
    } catch (err) {
      console.error("Error al conectar a la base de datos", err);
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

export default Database;