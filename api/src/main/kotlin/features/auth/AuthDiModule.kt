package xyz.aniways.features.auth

import com.resend.Resend
import org.koin.dsl.module
import xyz.aniways.Env
import xyz.aniways.features.auth.daos.*
import xyz.aniways.features.auth.services.AuthService
import xyz.aniways.features.auth.services.EmailService
import xyz.aniways.features.auth.services.KtorMalUserService
import xyz.aniways.features.auth.services.MalUserService

val authModule = module {
    factory {
        KtorMalUserService(get()) as MalUserService
    }

    factory {
        DbTokenDao(get()) as TokenDao
    }

    factory {
        DbSessionDao(get()) as SessionDao
    }

    factory {
        DbResetPasswordDao(get()) as ResetPasswordDao
    }

    factory {
        val env = get<Env>()

        EmailService(
            resendConfig = env.resendConfig,
            serverConfig = env.serverConfig
        )
    }

    factory {
        AuthService(
            sessionDao = get(),
            tokenDao = get(),
            resetPasswordDao = get(),
            userService = get(),
            emailService = get(),
        )
    }
}