const Location = require('../models/Location')
const Comment = require('../models/Comment')

const getLocation = async (req, res) => {
  try {
    const location = await Location.find()
    return res.status(200).json({ location })
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getLocationById = async (req, res) => {
  try {
    const { id } = req.params
    const location = await Location.findById(id).populate("locationComments")
    return res.status(200).json({ location })
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
    return res.status(200).json({ comments })
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Comment.findByIdAndDelete(id)
    if (deleted) {
      return res.status(200).send('Comment deleted')
    }
    throw new Error('Comment not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const createComment = async (req, res) => {
  try {
    const { id } = req.params
    console.log(req.body)
    const location = await Location.findOne({ _id: id })
    // console.log(location)
    const comment = await new Comment(req.body)
    console.log(comment)
    location.locationComments.push(comment._id)
    await comment.save()
    await location.save()
    return res.json(location)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    const comment = await Comment.updateOne(
      { _id: id },
      {
        $set: {
          commenter: req.body.commenter,
          comment: req.body.comment
        }
      }
    )
    return res.status(200).json({ comment })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getLocation,
  getLocationById,
  createComment,
  deleteComment,
  updateComment,
  getComments
}