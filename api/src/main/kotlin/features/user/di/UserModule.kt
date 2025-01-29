package xyz.aniways.features.user.di

import org.koin.dsl.module
import xyz.aniways.features.user.dao.DBUserDao
import xyz.aniways.features.user.dao.UserDao

val userModule = module {
    factory<UserDao> { DBUserDao(get()) }
}