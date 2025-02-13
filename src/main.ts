import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder().setTitle("DeFi API").setDescription("API endpoints for DeFi yield optimization and multisig operations").setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger module at the /api path
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
