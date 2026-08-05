from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Central config. All values are read from environment variables
    (or a local .env file during development). Never hardcode secrets.
    """

    database_url: str = "sqlite:///./dev.db"  # overridden by DATABASE_URL in prod
    secret_key: str = "change-me-in-env"       # overridden by SECRET_KEY in prod
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # Comma-separated list of allowed frontend origins, e.g.
    # "https://nbss.vercel.app,http://localhost:5173"
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"  # .env also holds seed-only vars (NBSS_ADMIN_*) that aren't app settings

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
