package xyz.aniways.features.user.exceptions

class UserNotFoundException(id: Int): Exception("User with MAL ID $id not found")