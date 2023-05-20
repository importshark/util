import { Compiler } from "webpack";
import sharp from "sharp";
import { urlToRequest } from 'loader-utils';
import { validate } from 'schema-utils';
import {stringify} from "flatted"




export default function (source) {
  console.log(source)
  console.log("\n\n\n\n\n\n")

  return source;
}