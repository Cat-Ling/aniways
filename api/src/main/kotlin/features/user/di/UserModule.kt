package xyz.aniways.features.user.di

import org.koin.dsl.binds
import org.koin.dsl.module
import xyz.aniways.features.user.dao.DBUserDao
import xyz.aniways.features.user.dao.UserDao

val userModule = module {
    factory { DBUserDao(get()) } binds arrayOf(UserDao::class)
}