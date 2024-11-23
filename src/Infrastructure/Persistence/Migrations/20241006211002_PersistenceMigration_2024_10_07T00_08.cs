using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_10_07T00_08 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_encoding_encoding_id",
                table: "servers");

            migrationBuilder.DropPrimaryKey(
                name: "pk_encoding",
                table: "encodings");

            migrationBuilder.RenameIndex(
                name: "ix_encoding_name",
                table: "encodings",
                newName: "ix_encodings_name");

            migrationBuilder.RenameIndex(
                name: "ix_encoding_code_page",
                table: "encodings",
                newName: "ix_encodings_code_page");

            migrationBuilder.AddPrimaryKey(
                name: "pk_encodings",
                table: "encodings",
                column: "id");

            migrationBuilder.CreateTable(
                name: "session",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date_created = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    date_updated = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    path = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    server_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_session", x => x.id);
                    table.ForeignKey(
                        name: "fk_session_servers_server_id",
                        column: x => x.server_id,
                        principalTable: "servers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_session_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_session_server_id",
                table: "session",
                column: "server_id");

            migrationBuilder.CreateIndex(
                name: "ix_session_user_id",
                table: "session",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_encodings_encoding_id",
                table: "servers",
                column: "encoding_id",
                principalTable: "encodings",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_servers_encodings_encoding_id",
                table: "servers");

            migrationBuilder.DropTable(
                name: "session");

            migrationBuilder.DropPrimaryKey(
                name: "pk_encodings",
                table: "encodings");

            migrationBuilder.RenameTable(
                name: "encodings",
                newName: "encoding");

            migrationBuilder.RenameIndex(
                name: "ix_encodings_name",
                table: "encoding",
                newName: "ix_encoding_name");

            migrationBuilder.RenameIndex(
                name: "ix_encodings_code_page",
                table: "encoding",
                newName: "ix_encoding_code_page");

            migrationBuilder.AddPrimaryKey(
                name: "pk_encoding",
                table: "encoding",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_servers_encoding_encoding_id",
                table: "servers",
                column: "encoding_id",
                principalTable: "encoding",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
