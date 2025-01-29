package xyz.aniways.features.user.exceptions

class UserNotFoundException(id: String): Exception("User with id $id not found")