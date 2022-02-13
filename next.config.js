/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */

const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n,
  APP_URL: process.env.APP_URL,
};
