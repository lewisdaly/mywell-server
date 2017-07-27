export default {
  ReadingModel: {
    findByPostcodeAndResourceId(context, postcode, resourceId) {
      context.mysql.raw(
        'SELECT * FROM reading WHERE postcode=? AND resourceId = ?',
        postcode,
        resourceId
      );
    }
  }
}
