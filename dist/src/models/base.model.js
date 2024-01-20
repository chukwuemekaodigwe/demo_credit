"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
class BaseService {
    constructor(resourcename) {
        this.resourcename = resourcename;
    }
    CreateResource(data) {
        return new Promise((resolve, reject) => {
            (0, connection_1.default)(this.resourcename)
                .insert(data)
                .then((res) => {
                connection_1.default.from(this.resourcename).select('*').where('id', res[0]).first().then(result => {
                    resolve(result);
                });
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    ReadResource(option) {
        return new Promise((resolve, reject) => {
            (0, connection_1.default)(this.resourcename)
                .select()
                .where(option)
                .then((res) => {
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    /**
     *
     * @param option the where codition object
     * this makes the resource reusable with any conditon
     * available to the child class
     * @returns object of the updated data
     */
    ReadSingleResource(option) {
        return new Promise((resolve, reject) => {
            (0, connection_1.default)(this.resourcename)
                .select()
                .where(option)
                .first()
                .then((res) => {
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    /**
     *
     * @param option the where condition object
     * @param data the updated data
     * @returns the result of the update
     */
    UpdateResource(option, data) {
        return new Promise((resolve, reject) => {
            (0, connection_1.default)(this.resourcename)
                .where(option)
                .update(data)
                .then((res) => {
                connection_1.default.from(this.resourcename).select('*').where(option).first().then(result => {
                    resolve(result);
                });
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    /**
     *
     * @param option The where condition objet
     *
     * eg {id: idData}
     * @returns the deleted resource
     */
    DeleteResource(option) {
        return new Promise((resolve, reject) => {
            (0, connection_1.default)(this.resourcename)
                .where(option)
                .del()
                .then((res) => {
                resolve(res);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    ResourceById(id) {
        return new Promise((resolve, reject) => {
            (0, connection_1.default)(this.resourcename)
                .where('id', id)
                .first()
                .then(res => {
                resolve(res);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
}
exports.default = BaseService;
