package xyz.aniways.features.auth.services

import com.resend.Resend
import com.resend.services.emails.model.CreateEmailOptions
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import xyz.aniways.Env

class EmailService(
    private val serverConfig: Env.ServerConfig,
    private val resendConfig: Env.ResendConfig,
) {
    private val resendClient = Resend(resendConfig.apiKey)

    suspend fun sendResetPasswordEmail(to: String, resetToken: String) {
        return withContext(Dispatchers.IO) {
            val resetLink = "${serverConfig.frontendUrl}/reset-password?token=$resetToken"

            val options = CreateEmailOptions.builder()
                .from(resendConfig.fromEmail)
                .to(to)
                .subject("Reset your password")
                .html(
                    """
                        <p>Click the link below to reset your password:</p>
                        <a href="$resetLink">Reset Password</a>
                        <br>
                        <p>If you did not request this, please ignore this email.</p>
                        <small>Note: This link will expire in 15 minutes.</small>
                    """.trimIndent()
                )
                .build()

            resendClient.emails().send(options)
        }
    }
}