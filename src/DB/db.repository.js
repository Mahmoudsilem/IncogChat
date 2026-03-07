import { userSchema } from "./index.js";

class DBRepository {
  constructor(nModel) {
    this.nModel = nModel;
  }
  async create({
     data = [{}],
     options = { validateBeforeSave: true }
     }) {
    return await this.nModel.create(data, options);
  }
  async createOne({
     data = [{}],
     options = { validateBeforeSave: true }
     }) {
    return await this.create({ data:[data], options });
  }
  
  async findOne({
     filter = {},
     select = "",
     options = {},
    }) {
    const doc = this.nModel.findOne(filter, options).select(select);
    if (options.lean){
        doc.lean();
    }
    if (options.populate){
        doc.populate(options.populate);
    }
    return await doc.exec();
  }
}

export const userRepository = new DBRepository(userSchema);
