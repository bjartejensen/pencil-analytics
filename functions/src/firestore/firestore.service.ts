import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { DBProduct } from "../interfaces/product.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FirestoreService {
  private firestore: FirebaseFirestore.Firestore;

  // @TODO auth to the database
  constructor(private readonly configService: ConfigService) {
    admin.initializeApp(functions.config().firebase);
    this.firestore = admin.firestore();
  }

  get db(): FirebaseFirestore.Firestore {
    return this.firestore;
  }

  //cheked
  async getProductById(productId: string): Promise<DBProduct> {
    const productsCollection = this.configService.get<string>(
      "FIRESTORE_PRODUCTS_COLLECTION"
    );

    const result = await this.db
      .collection(`${productsCollection}`)
      .doc(productId)
      .get();
    return result.exists ? (result.data() as DBProduct) : null;
  }
}
