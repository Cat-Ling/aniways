package xyz.aniways.features.users

import org.koin.dsl.module
import xyz.aniways.features.users.dao.DbUserDao
import xyz.aniways.features.users.dao.UserDao

val userModule = module {
    factory { DbUserDao(get()) as UserDao }

    factory { UserService(get()) }
}