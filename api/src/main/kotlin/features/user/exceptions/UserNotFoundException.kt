package xyz.aniways.features.user.exceptions

class UserNotFoundException(id: String): Exception(
    message = "User with id $id not found"
)