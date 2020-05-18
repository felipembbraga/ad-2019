import { ConsumeMessage } from "amqplib";

export interface JsonConsumeMessage extends ConsumeMessage {
    content: any
}