const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

// Configure the DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create a DynamoDB Document Client
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "harrypotter-api";

const getCharacters = async () => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const characters = await docClient.send(new ScanCommand(params));

    console.log(characters.Items);

    return characters.Items;
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};

const addOrUpdateCharacter = async character => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Item: character
    }
    const result = await docClient.send(new PutCommand(params));
    console.log("Successfully added item:", result);
    return result;
  } catch (error) {
      console.error("Error creating character:", error);
      throw error;
  }
}

const getCharacterById = async id => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id
      }
    };

    const characters = await docClient.send(new ScanCommand(params));

    console.log(characters.Items);

    return characters.Items;
  } catch (error) {
    console.error("Error fetching character:", error);
    throw error;
  }
}

const deleteCharacterById = async id => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id
      }
    };

    const characters = await docClient.send(new DeleteItemCommand(params));
  } catch (error) {
    console.error("Error deleting character:", error);
    throw error;
  }
}

module.exports = {
  dynamoClient,
  getCharacters,
  getCharacterById,
  addOrUpdateCharacter,
  deleteCharacterById
}