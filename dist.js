"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = handler;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function handler(_x, _x2) {
  return _handler.apply(this, arguments);
}

function _handler() {
  _handler = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _require, GoogleSpreadsheet, doc, sheet, _require2, SESClient, SendEmailCommand, client, command;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(req.method !== "POST")) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", res.status(405).json());

          case 2:
            console.log("New form submission", req.body); // Add row in a Google sheet

            if (!process.env.FORMTASTIK_SHEET_URL) {
              _context.next = 13;
              break;
            }

            _require = require("google-spreadsheet"), GoogleSpreadsheet = _require.GoogleSpreadsheet;
            doc = new GoogleSpreadsheet(process.env.FORMTASTIK_SHEET_URL);
            _context.next = 8;
            return doc.useServiceAccountAuth({
              client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
              private_key: process.env.GOOGLE_PRIVATE_KEY
            });

          case 8:
            _context.next = 10;
            return doc.loadInfo();

          case 10:
            sheet = doc.sheetsByIndex[0];
            _context.next = 13;
            return sheet.addRow(req.body);

          case 13:
            if (!(process.env.FORMTASTIK_EMAIL_TO && process.env.FORMTASTIK_EMAIL_FROM)) {
              _context.next = 25;
              break;
            }

            _require2 = require("@aws-sdk/client-ses"), SESClient = _require2.SESClient, SendEmailCommand = _require2.SendEmailCommand;
            client = new SESClient({
              region: "eu-west-1"
            });
            command = new SendEmailCommand({
              Source: process.env.FORMTASTIK_EMAIL_FROM,
              Destination: {
                ToAddresses: [process.env.FORMTASTIK_EMAIL_TO]
              },
              Message: {
                Body: {
                  Html: {
                    Charset: "UTF-8",
                    Data: Object.keys(req.body).map(function (key) {
                      return "<strong>".concat(key, "</strong>: ").concat(req.body[key]);
                    }).join("<br />")
                  },
                  Text: {
                    Charset: "UTF-8",
                    Data: Object.keys(req.body).map(function (key) {
                      return "".concat(key, ": ").concat(req.body[key]);
                    }).join("\n")
                  }
                },
                Subject: {
                  Charset: "UTF-8",
                  Data: "New form submission"
                }
              }
            });
            _context.prev = 17;
            _context.next = 20;
            return client.send(command);

          case 20:
            _context.next = 25;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context["catch"](17);
            console.error(_context.t0);

          case 25:
            res.status(201).json();

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[17, 22]]);
  }));
  return _handler.apply(this, arguments);
}
