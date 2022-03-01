import config from "../../config/Index"
import { createTransport } from "nodemailer"
import MailTemplate from "./MailTemplate"
import { Mail } from "../../interfaces/Mail"
import Logger from "../../loaders/Logger"

const sendNodeMail = async ({
  to,
  subject,
  message,
  html = MailTemplate({ message }),
}: Mail) => {
  try {
    const transport = createTransport({
      service: "yahoo",
      auth: {
        user: config.sender.email,
        pass: config.sender.password,
      },
    })

    const mailOptions = {
      from: `'NodeJS, Postgres, and Rest Framework' ${config.sender.email}`,
      to,
      replyTo: config.sender.email,
      subject,
      html,
    }

    return await transport.sendMail(mailOptions)
  } catch (error) {
    Logger.error("Email error ==>> ", error)
  }
}

export { sendNodeMail as SendMail }
