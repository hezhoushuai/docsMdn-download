"use strict";

var _path = _interopRequireDefault(require("path"));

var _debug = _interopRequireDefault(require("debug"));

var _fsWrapper = require("./modules/fsWrapper.js");

var _fs = require("fs");

var _getLinks = _interopRequireDefault(require("./modules/getLinks.js"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _create = require("./modules/create.js");

var _recursDirs = _interopRequireDefault(require("./modules/recursDirs.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debugOutput = (0, _debug["default"])('_h:main');

var DOWNLOAD_DIR_PATH = _path["default"].resolve('./downloads');

var URL_LOG_FILE_PATH = _path["default"].resolve("./logFile.txt");

var DOWNLOAD_URL_REG = [/gw.alipayobjects.com/, /\.(jpg|png|svg|json|csv)$/];

function downloadFile(link) {
  var filePath, resp, writeStream;
  return regeneratorRuntime.async(function downloadFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          filePath = _path["default"].join(DOWNLOAD_DIR_PATH, link.replace(/(^\w+:|^)\/\//, ''));
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _create.isExit)(filePath));

        case 3:
          if (!_context.sent) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", true);

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap((0, _nodeFetch["default"])(link, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          })["catch"](function (e) {
            return debugOutput(e.message);
          }));

        case 7:
          resp = _context.sent;

          if (resp) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", false);

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _create.createFile)(filePath, ''));

        case 12:
          writeStream = (0, _fs.createWriteStream)(filePath);
          resp.body.pipe(writeStream);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
}

(function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap((0, _fsWrapper.writeFilePro)(URL_LOG_FILE_PATH, ""));

        case 2:
          _context4.next = 4;
          return regeneratorRuntime.awrap((0, _recursDirs["default"])(_path["default"].resolve("../"), function _callee(curpath) {
            var links, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

            return regeneratorRuntime.async(function _callee$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.t0 = _getLinks["default"];
                    _context3.next = 3;
                    return regeneratorRuntime.awrap((0, _fsWrapper.readFilePro)(curpath, "utf8"));

                  case 3:
                    _context3.t1 = _context3.sent;
                    links = (0, _context3.t0)(_context3.t1);
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context3.prev = 8;

                    _loop = function _loop() {
                      var link;
                      return regeneratorRuntime.async(function _loop$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              link = _step.value;

                              if (!DOWNLOAD_URL_REG.some(function (reg) {
                                return reg.test(link);
                              })) {
                                _context2.next = 7;
                                break;
                              }

                              debugOutput("[downloads]: \u5F00\u59CB\u4E0B\u8F7D".concat(link));
                              _context2.next = 5;
                              return regeneratorRuntime.awrap(downloadFile(link));

                            case 5:
                              _context2.next = 7;
                              return regeneratorRuntime.awrap((0, _fsWrapper.appendFilePro)(URL_LOG_FILE_PATH, link + ', '));

                            case 7:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      });
                    };

                    _iterator = links[Symbol.iterator]();

                  case 11:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context3.next = 17;
                      break;
                    }

                    _context3.next = 14;
                    return regeneratorRuntime.awrap(_loop());

                  case 14:
                    _iteratorNormalCompletion = true;
                    _context3.next = 11;
                    break;

                  case 17:
                    _context3.next = 23;
                    break;

                  case 19:
                    _context3.prev = 19;
                    _context3.t2 = _context3["catch"](8);
                    _didIteratorError = true;
                    _iteratorError = _context3.t2;

                  case 23:
                    _context3.prev = 23;
                    _context3.prev = 24;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 26:
                    _context3.prev = 26;

                    if (!_didIteratorError) {
                      _context3.next = 29;
                      break;
                    }

                    throw _iteratorError;

                  case 29:
                    return _context3.finish(26);

                  case 30:
                    return _context3.finish(23);

                  case 31:
                  case "end":
                    return _context3.stop();
                }
              }
            }, null, null, [[8, 19, 23, 31], [24,, 26, 30]]);
          }));

        case 4:
          debugOutput("完成文件下载任务");

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
})();