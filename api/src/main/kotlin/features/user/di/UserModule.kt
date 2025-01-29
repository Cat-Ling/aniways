package xyz.aniways.features.user.di

import org.koin.dsl.module
import xyz.aniways.features.user.dao.DBSettingsDao
import xyz.aniways.features.user.dao.DBUserDao
import xyz.aniways.features.user.dao.SettingsDao
import xyz.aniways.features.user.dao.UserDao
import xyz.aniways.features.user.services.UserService

val userModule = module {
    factory<UserDao> { DBUserDao(get()) }
    factory<SettingsDao> { DBSettingsDao(get()) }
    factory { UserService(get(), get(), get()) }
}