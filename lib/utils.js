module.exports.waitFor = (seconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
};