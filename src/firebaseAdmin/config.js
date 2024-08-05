import {
  initializeApp,
  credential as _credential,
  firestore,
} from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "fastfinite-bike-rental",
  private_key_id: "aa52d886c66b0cbfc61504f8eda96cd7398638cb",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgSynEhZYEyhOR\nymoAPlih0GodmXIylFXhn5E24+7cWqZ2Mv16n2xTAzwOj7pBR6yVOBlq8y9dafOu\nM0TimxPMXMczA12LoXyUFALg8toCLK5NhmmhAhb3j7gJp8u9H16rlMWPeD4LGo03\nB+SuMVVMdQ+6FJxiAaslWOPC3Mq2PlGpkPyVfai9IAvJIowQS34OTgRBNPTRfyWc\nNG/8FQUehTiApVRCpVF5/Ucuueu9mTb7qkWdDRhxHi0souq3Y5LL9KqrHf9B/NLM\nMzS0VP9kK5fejG7qzhL2OxdOgPoD7s1toXMg/yOmKimUC8Qs0ESJA+RXfSKyydZB\nnPJeY/wtAgMBAAECggEAAesZszNnaePtO10byv2esUO9nAsTwHfhVejt+PqIsknC\nHOoGpJVh24B6EzE0fnGC0ZUGoNlg42eli0aBIuEjlIThEW2PN2DrDRlMNjBR3Egi\nnI+Tlgy2BP0gVmU+sqMRzqXiKLxnVFoF/0xF4rEjyd12Hw5TbMzY+oJyKgkwbTaU\nM6l4te26xLXubLsYmdg8oAEtwp3UgneLWwxOqUAI9hfw5SEUkxv9el3p0dmZM6eH\nSdF/kikDS02o8qbtoExD1WREnRLW3WQf7Dc2KZVA2F9cEhNXYjecF8rHjhv1bgrS\nU2gBBJVg+TpQWl1a1EoONFwoWG/OXpXPk8+wBi7O1QKBgQDRYmpKS/Za07gx/dlx\njdGTWVIre0At5DuLYGnQtUXTacnyZOsvA1f0qGnHHw7G+GQu1Io7324ERgeCIXxn\n4aioOgSdRKoea2lKJGYu6rczgPBW7DS2ikBkld28l/M2nI34sWtam5McGVdqmIFL\nXyzFKKTuNbwrjhfx55MPQYZKtwKBgQDD+uHQnq6R++Pxux9TbhNGx4sZysSlwWax\nbn4D10hTSErj12kUUl/+KETHZpHiwbRzv7qDDWWYJR6jG7picsKZFYycI7iMqaV9\n4drTQ40elj6zCrAFxG52wjcNnLW7yaYfn0W7oldkzxiDW5hxhW9Uz1WzdnUWkRtf\nTqMgoCFcOwKBgCtAqzhBzNgiWDBrgdmFND+9+c1lnnJcbThzaChm6c+sUL0zv6ls\nhWTSzVcGwWS0tu09lnibxPw5AyAMjshewxpNMdrS7lluUsewETOr5MBM6FjsXk8+\n6+JbWvy0XtdvK5yt+cEz1gW97mLksgDB3luz864Jh59vsN6VubkzDeytAoGAZSfC\nlK7DBmDQl/3wvlxroLXwS2DIvZGk0uJoMs1U7H+8//s4pp+aIpJgZdfAZx16aeBF\ngc1RagWG2cO/IX+AiAmCaTla0WfjHqWMEE2msmn0dO+ISYHJTo0SY3lGqGX91Aae\ntKmnmEX4rhyCA95Ox6S45Ie5CeveCASL2JQug+8CgYAhz6zYp5NoZuj/tS+O06ZJ\nWABcEYXF1hcpFsitBEsAjlOioXQHVlTRr/Tnn6YhCRGTLBaMNX8ZrrfrQusvk5wI\nJDWCKZK/eC8Bi+KG/45BzzwSiObqsgnU/VIBvKn1ST/jK6KaivGj+tciofgvzz8x\nrAGX5PHHtVq8ym71/KkMSQ==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-56da7@fastfinite-bike-rental.iam.gserviceaccount.com",
  client_id: "107841784244473070787",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-56da7%40fastfinite-bike-rental.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

initializeApp({
  credential: _credential.cert(serviceAccount),
});

const admin = {
  firestore: firestore(),
};

export default admin;
