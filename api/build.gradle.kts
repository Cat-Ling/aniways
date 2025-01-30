buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath(libs.driver.postgres)
    }
}

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ktor)
}

group = "xyz.aniways"
version = "0.0.1"

application {
    mainClass.set("io.ktor.server.netty.EngineMain")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}


repositories {
    mavenCentral()
    maven { url = uri("https://packages.confluent.io/maven/") }
}

dependencies {
    // Ktor Server dependencies
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.resources)
    implementation(libs.ktor.server.rate.limit)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation(libs.ktor.server.config.yaml)
    implementation(libs.ktor.server.auth)
    implementation(libs.ktor.server.auth.jwt)

    // Ktor Client dependencies
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.cio)
    implementation(libs.ktor.client.logging)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.client.cio.jvm)

    // Dependency Injection with Koin
    implementation(libs.koin.ktor)
    implementation(libs.koin.logger.slf4j)

    // Logging Dependencies
    implementation(libs.logback.classic)

    // Web Scraping Dependencies
    implementation(libs.jsoup)

    // Database Dependencies
    implementation(libs.ktorm.core)
    implementation(libs.hikari.core)
    implementation(libs.flyway.core)
    implementation(libs.flyway.database.postgresql)

    // Testing Dependencies
    testImplementation(libs.kotlin.test)
    testImplementation(libs.kotlin.test.junit)
    testImplementation(libs.ktor.server.tests)
}
