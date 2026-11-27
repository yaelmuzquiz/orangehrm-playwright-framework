import dotenv from 'dotenv';

// Load .env if present (local convenience). Do not commit .env to the repo.
dotenv.config();

function required(name: string, value?: string) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const baseURL = required('ORANGEHRM_BASE_URL', process.env.ORANGEHRM_BASE_URL);
const parsedBaseURL = URL.canParse(baseURL) ? new URL(baseURL) : undefined;
if (parsedBaseURL?.protocol !== 'https:' && parsedBaseURL?.protocol !== 'http:') {
  throw new Error('ORANGEHRM_BASE_URL must be an absolute HTTP or HTTPS URL');
}
parsedBaseURL.pathname = `${parsedBaseURL.pathname.replace(/\/+$/, '')}/`;
export const ORANGEHRM_BASE_URL = parsedBaseURL.href;

export const ORANGEHRM_USERNAME = (() => {
  return required('ORANGEHRM_USERNAME', process.env.ORANGEHRM_USERNAME);
})();

export const ORANGEHRM_PASSWORD = (() => {
  return required('ORANGEHRM_PASSWORD', process.env.ORANGEHRM_PASSWORD);
})();

export default {
  ORANGEHRM_BASE_URL,
  ORANGEHRM_USERNAME,
  ORANGEHRM_PASSWORD,
};
