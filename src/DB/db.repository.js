import { massageSchema, userSchema } from "./index.js";

class DBRepository {
  constructor(nModel) {
    this.nModel = nModel;
  }
  async create({ data = [{}], options = { validateBeforeSave: true } }) {
    return await this.nModel.create(data, options);
  }
  async createOne({ data = [{}], options = { validateBeforeSave: true } }) {
    return await this.create({ data: [data], options });
  }

  async findOne({ filter = {}, select = "", options = {} }) {
    const doc = this.nModel.findOne(filter,select, options).select(select);
    if (options.lean) {
      doc.lean();
    }
    // if (options.populate) {
    //   doc.populate(options.populate);
    // }
    return await doc.exec();
  }
  async find({ filter = {}, select = "", options = {} }) {
    const doc = this.nModel.find(filter,select, options).select(select);
    if (options.lean) {
      doc.lean();
    }
    // if (options.populate) {
    //   doc.populate(options.populate);
    // }
    return await doc.exec();
  }
  async updateOne({
    filter = {},
    update = {},
    options = { },
  }) {
    return await this.nModel.updateOne(filter, update, options);
  }
  async findOneAndUpdate({
    filter = {},
    update = {},
    options = { returnDocument: "after" },
  }) {
    return await this.nModel.findOneAndUpdate(filter, update, options);
  }
  
}
export const userRepository = new DBRepository(userSchema);
export const massageRepository = new DBRepository(massageSchema);