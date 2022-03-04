// Logic inspired by: https://github.com/vymarkov/sql-injection/blob/master/lib/index.js
import { NextFunction, Request, Response } from "express"
import ErrorResponse from "../../managers/error/ErrorResponse"

const hasSql = (value: string) => {
  // sql regex reference: http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks

  const checks = [
    // Regex for detection of SQL meta-characters
    "(%27)|(')|(--)|(%23)|(#)/ix",
    // Modified regex for detection of SQL meta-characters
    "/((%3D)|(=))[^\n]*((%27)|(')|(--)|(%3B)|(;))/i",
    // Regex for typical SQL Injection attack
    "/w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))/ix",
    /(((((where|and|set)(\s+[\w\(]+[.]*[\w\)]*\s*)=\s*'?|like\s+'?%?|in\s+\(|top\s*|from|order\s*by|table)\s*)|(values\s*\(.*))("\s*\+|{\d+}))/gi,
    /('(''|[^'])*')|(\)\;)|(--)|(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|VERSION|ORDER|UNION( +ALL){0,1})/gim,
  ]

  return checks.some((expression) => {
    const regex = new RegExp(expression)

    return regex.test(value)
  })
}

const preventSQLInjection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (hasSql(req.originalUrl)) {
    throw new ErrorResponse({
      message: "Dirty request!",
      statusCode: 403,
    })
  }

  const body = JSON.stringify(req.body)

  if (hasSql(body) === true) {
    throw new ErrorResponse({
      message: "Dirty request!",
      statusCode: 403,
    })
  }

  next()
}

export default preventSQLInjection
