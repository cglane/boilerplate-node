import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';


const MessageSchema = new mongoose.Schema({
  s_body:{
    type:String,
    required: true
  },
  companyMessage: Boolean,
  s_type:String,
  clientId:{
    type:String,
    required:true
  },
  userId:String,
  s_subject:{
    type:String,
    required:String
  },
  s_sender:{
    type:String,
    default:"noreply@gdg.do"
  },
  s_iconClass:{
    type:String,
    default:"fa fa-envelope-o"
  },
  s_prompt:String,
  s_route:String,
  s_archive:{
    type:Boolean,
    default:false
  },
  s_routeParams:String,
  s_unread:{
    type:Boolean,
    default:true
  },
  s_recipient:{
    type:String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

/***
Define Statics
**/

MessageSchema.statics = {
  /**
   * Get user messages
   * @param {String} id - The objectId of user.
   * @returns {Promise<Message, APIError>}
   */
  getUserMessages(id) {
    return this.findOne({'userId':id})
      .lean()
      .exec()
      .then((userMsgs) => {
        if (userMsgs) {
          return userMsgs;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
  * Archive individual Message
  * @param {objectId} id - The objectId of message
  * @returns {Promise<Message, APIError>}
  ***/
  archiveMsg(id){
    return this.findOneAndUpdate({'_id':id},
    {$set:{s_archive:true}})
    .exec()
    .then((archiveMsg)=>{
      if(archiveMsg){
        return {'status':httpStatus.OK,'message':`Message with id: ${id}  Archived`}
      }
      const err = new APIError(`No message exists with id of: ${id}`, httpStatus.NOT_FOUND);
      return Promise.reject(err);
    })
  },
  /**
  * @param {objectId} id - The objectId of message
  * @param {Promise<Message, APIError>}
  **/
  deleteMsg(id){
    return this.findByIdAndRemove(id)
    .exec()
    .then((message)=>{
      if(message){
        return {'status':httpStatus.OK,'message':`Message with id: ${id} Deleted`}
      }
      const err = new APIError(`No message exists with id of: ${id}`, httpStatus.NOT_FOUND);
      return Promise.reject(err);
    })
  },
  /**
  * Find all company messages per clientId
  * @param {String} id - clientId
  * @param {Promise<Message, APIError>}
  **/
  getCompanyMessages(id){
    return this.find({'companyMessage':true,'clientId':id})
      .lean()
      .exec()
      .then((messages)=>{
        if(messages){
          return messages
        }
        const err = new APIError(`No company messages for client: ${id}, found`, httpStatus.NOT_FOUND);
        return Promise.reject(err)
      })
  },
  /**
  * Create a message record
  * @param {Object} msg - message record to be saved
  * @param {Promise<Message, APIError>}
  **/
  createMsg(msg){
    return this.save(msg)
      .exec()
      .then((record)=>{
        if(record){
          return record
        }
        const err = new APIError(`No message created`, httpStatus.INTERNAL_SERVER_ERROR);
        return Promise.reject(err)
      })
  }
}

export default mongoose.model('Messages', MessageSchema);
