'use strict'

const Businesses = use('App/Models/Business')
const BusinessComments = use('App/Models/BusinessComment')

class BusinessCommentController {
  async commentsLoader({ params, view, auth }) {
    const businessBeingCommented = await Businesses.find(params.id);

    const comments = await BusinessComments
      .query()
      .where('business_id', params.id)
      .orderBy('id', '1')
      .fetch()

    const theId = auth.user.id;

    return view.render('comments/business_comments', { businessBeingCommented: businessBeingCommented, theId, comments: comments.toJSON() })
  }

  async sendComment({ request, auth, response, params }) {
    const comment = request.all();
    const businessId = params.id;
    const business = await Businesses.find(params.id);

    const userId = auth.user.id;
    const username = auth.user.username;

    const posted = await BusinessComments.create({
      comment: comment.business_comment_message,
      user_id: userId,
      username: username,
      business_id: businessId
    });

    const commentCount = await BusinessComments
      .query()
      .where('business_id', params.id)
      .getCount();

    business.comment_amount = commentCount;

    await business.save();

    return response.redirect('back');
  }

  async deleteComment({ params, response }) {
    const comment = await BusinessComments.find(params.id);
    await comment.delete();

    return response.redirect('back');
  }
}

module.exports = BusinessCommentController
