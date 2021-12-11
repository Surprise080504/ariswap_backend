const Settings = require('../../models/settings.model')
const Mail = require('../../models/email.model')
const {emailAdd} = require('../../../config/vars')

//send email to mentioned users
exports.sendEmail = async (email = '', type = '', content = null, subject = '') => {
  if (email !== '') {

    const getTemplate = await Mail.findOne({ type })

    if (getTemplate) {
      const { api, domain } = await Settings.findOne()

      var mailgun = require('mailgun-js')({ apiKey: api, domain: domain });

      let sub = ''

      if(subject){
        sub = subject
      }
      else{
        sub = getTemplate.subject
      }

      const msg = {
        to: email,
        from: emailAdd,
        subject: sub,
        html: getHtml(getTemplate, content)
      };

      mailgun.messages().send(msg, function (err) {
        if (err) {
          //console.log(err)
        }
        else {
          //console.log("Mail sent successfully!")
        }
      });
    }
  }
}

function getHtml(getTemplate, content) {
  let text = getTemplate.text
  if (content) {
    for (let key in content) {
      text = text.replace(`${key}`, "'" + `${content[key]}` + "'")
    }
  }
  return text
}







