import { google, type gmail_v1 } from "googleapis";

const CONNECTOR_NAME = "google-mail";

const getReplitToken = (): string => {
  if (process.env["REPL_IDENTITY"]) {
    return `repl ${process.env["REPL_IDENTITY"]}`;
  }
  if (process.env["WEB_REPL_RENEWAL"]) {
    return `depl ${process.env["WEB_REPL_RENEWAL"]}`;
  }
  throw new Error(
    "X_REPLIT_TOKEN not found — Replit identity is not available in this environment.",
  );
};

const getAccessToken = async (): Promise<string> => {
  const hostname = process.env["REPLIT_CONNECTORS_HOSTNAME"];
  if (!hostname) {
    throw new Error(
      "REPLIT_CONNECTORS_HOSTNAME is not set — connectors are not available.",
    );
  }

  const xReplitToken = getReplitToken();

  const url = `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=${CONNECTOR_NAME}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      X_REPLIT_TOKEN: xReplitToken,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Gmail connection (${response.status} ${response.statusText})`,
    );
  }

  const data: {
    items?: Array<{
      settings?: {
        access_token?: string;
        oauth?: { credentials?: { access_token?: string } };
      };
    }>;
  } = await response.json();

  const connection = data.items?.[0];
  const accessToken =
    connection?.settings?.access_token ??
    connection?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error(
      "Gmail is not connected. Please connect Gmail in the Replit integrations panel.",
    );
  }

  return accessToken;
};

export const getUncachableGmailClient = async (): Promise<gmail_v1.Gmail> => {
  const accessToken = await getAccessToken();
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.gmail({ version: "v1", auth });
};
