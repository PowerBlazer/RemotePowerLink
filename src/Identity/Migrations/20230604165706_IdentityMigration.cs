using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PowerMessenger.Infrastructure.Identity.Migrations
{
    /// <inheritdoc />
    public partial class IdentityMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "identity_users",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: true),
                    date_created = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_identity_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "identity_tokens",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    token = table.Column<string>(type: "text", nullable: false),
                    expiration = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_identity_tokens", x => x.id);
                    table.ForeignKey(
                        name: "fk_identity_tokens_identity_users_user_id",
                        column: x => x.user_id,
                        principalTable: "identity_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "identity_users",
                columns: new[] { "id", "date_created", "email", "email_confirmed", "password_hash", "phone_number", "two_factor_enabled" },
                values: new object[,]
                {
                    { 1L, new DateTimeOffset(new DateTime(2023, 6, 4, 16, 57, 6, 311, DateTimeKind.Unspecified).AddTicks(5616), new TimeSpan(0, 0, 0, 0, 0)), "yak.ainur@yandex.ru", true, "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", null, false },
                    { 2L, new DateTimeOffset(new DateTime(2023, 6, 4, 16, 57, 6, 311, DateTimeKind.Unspecified).AddTicks(5620), new TimeSpan(0, 0, 0, 0, 0)), "power.blaze@mail.ru", true, "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", null, false }
                });

            migrationBuilder.InsertData(
                table: "identity_tokens",
                columns: new[] { "id", "expiration", "token", "user_id" },
                values: new object[,]
                {
                    { 1L, new DateTime(2023, 6, 11, 19, 57, 6, 311, DateTimeKind.Local).AddTicks(8521), "121212121212121", 1L },
                    { 2L, new DateTime(2023, 6, 11, 19, 57, 6, 311, DateTimeKind.Local).AddTicks(8541), "1212121212121212", 2L }
                });

            migrationBuilder.CreateIndex(
                name: "ix_identity_tokens_token",
                table: "identity_tokens",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_identity_tokens_user_id",
                table: "identity_tokens",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_identity_users_email",
                table: "identity_users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "identity_tokens");

            migrationBuilder.DropTable(
                name: "identity_users");
        }
    }
}
