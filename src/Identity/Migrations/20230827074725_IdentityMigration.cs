using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Identity.Migrations
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
                    expiration = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ip_address = table.Column<string>(type: "text", nullable: false),
                    device_name = table.Column<string>(type: "text", nullable: true)
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
                    { 1L, new DateTimeOffset(new DateTime(2023, 8, 27, 7, 47, 25, 635, DateTimeKind.Unspecified).AddTicks(5145), new TimeSpan(0, 0, 0, 0, 0)), "yak.ainur@yandex.ru", true, "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", null, false },
                    { 2L, new DateTimeOffset(new DateTime(2023, 8, 27, 7, 47, 25, 635, DateTimeKind.Unspecified).AddTicks(5151), new TimeSpan(0, 0, 0, 0, 0)), "power.blaze@mail.ru", true, "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", null, false }
                });

            migrationBuilder.InsertData(
                table: "identity_tokens",
                columns: new[] { "id", "device_name", "expiration", "ip_address", "token", "user_id" },
                values: new object[,]
                {
                    { 1L, null, new DateTime(2023, 9, 3, 10, 47, 25, 636, DateTimeKind.Local).AddTicks(3506), "023424924", "121212121212121", 1L },
                    { 2L, null, new DateTime(2023, 9, 3, 10, 47, 25, 636, DateTimeKind.Local).AddTicks(3546), "12034024", "1212121212121212", 2L }
                });

            migrationBuilder.CreateIndex(
                name: "ix_identity_tokens_ip_address",
                table: "identity_tokens",
                column: "ip_address",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_identity_tokens_token",
                table: "identity_tokens",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_identity_tokens_user_id",
                table: "identity_tokens",
                column: "user_id");

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
