const path = require('path');

module.exports = {
  // 기존 설정들

  resolve: {
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      // 다른 필요한 fallback 설정도 여기에 추가할 수 있습니다
    },
  },
};
