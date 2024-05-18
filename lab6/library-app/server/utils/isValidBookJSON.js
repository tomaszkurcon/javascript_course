const isValidBookJSON = (jsonString) => {
  try {
    const requiredFields = [
      "book_name",
      "authors",
      "faculty",
      "subject",
      "course",
      "imgURL",
      "amount",
    ];
    return requiredFields.every((field) => jsonString.hasOwnProperty(field));
  } catch (e) {
    return false;
  }
};
exports.isValidBookJSON = isValidBookJSON;
