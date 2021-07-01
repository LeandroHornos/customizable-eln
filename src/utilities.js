export const makeId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getTextPreview = (text, charLimit) => {
  if (text.length > charLimit) {
    text = text.substring(0, charLimit) + "...";
  }
  return text;
};

export const groupAsTriplets = (items) => {
  // Create a 2D array where every element is an array of 3 items.
  // It can be used to make rows with 3 items each.

  let triplets = [];
  let triplet = [];
  let count = 0;
  items.forEach((item) => {
    if (count < 2) {
      triplet.push(item);
      count++;
    } else {
      triplet.push(item);
      triplets.push(triplet);
      triplet = [];
      count = 0;
    }
  });
  if (triplet.length > 0) {
    triplets.push(triplet);
  }
  return triplets;
};

export const checkObj = (obj) => {
  let exists = false;
  let isEmpty = true;
  if (obj) {
    exists = true;
    isEmpty = Object.keys(obj).length === 0 && obj.constructor === Object;
    if (obj) {
      exists = true;
    }
  }

  return { exists, isEmpty };
};

export const checkArray = (array) => {
  let exists = false;
  let isEmpty = true;
  if (array) {
    exists = true;
    if (array.length > 0) {
      isEmpty = false;
    }
  }
  return { exists, isEmpty };
};
