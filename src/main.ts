import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const corsOptions: CorsOptions = {
    origin: configService.get<string>("CORS_ORIGIN", "*"), // Allow all origins by default
    methods: configService.get<string>("CORS_METHODS", "GET,HEAD,PUT,PATCH,POST,DELETE"),
    credentials: configService.get<boolean>("CORS_CREDENTIALS", true),
  };

  app.enableCors(corsOptions);
  // Swagger configuration
  const config = new DocumentBuilder().setTitle("DeFi API").setDescription("API endpoints for DeFi yield optimization and multisig operations").setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger module at the /api path
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
