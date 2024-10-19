using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_10_19T18_50 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_session_servers_server_id",
                table: "session");

            migrationBuilder.DropForeignKey(
                name: "fk_session_users_user_id",
                table: "session");

            migrationBuilder.DropPrimaryKey(
                name: "pk_session",
                table: "session");

            migrationBuilder.DropColumn(
                name: "date_updated",
                table: "session");

            migrationBuilder.RenameTable(
                name: "session",
                newName: "sessions");

            migrationBuilder.RenameIndex(
                name: "ix_session_user_id",
                table: "sessions",
                newName: "ix_sessions_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_session_server_id",
                table: "sessions",
                newName: "ix_sessions_server_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_sessions",
                table: "sessions",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_sessions_servers_server_id",
                table: "sessions",
                column: "server_id",
                principalTable: "servers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_sessions_users_user_id",
                table: "sessions",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_sessions_servers_server_id",
                table: "sessions");

            migrationBuilder.DropForeignKey(
                name: "fk_sessions_users_user_id",
                table: "sessions");

            migrationBuilder.DropPrimaryKey(
                name: "pk_sessions",
                table: "sessions");

            migrationBuilder.RenameTable(
                name: "sessions",
                newName: "session");

            migrationBuilder.RenameIndex(
                name: "ix_sessions_user_id",
                table: "session",
                newName: "ix_session_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_sessions_server_id",
                table: "session",
                newName: "ix_session_server_id");

            migrationBuilder.AddColumn<DateTime>(
                name: "date_updated",
                table: "session",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "pk_session",
                table: "session",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_session_servers_server_id",
                table: "session",
                column: "server_id",
                principalTable: "servers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_session_users_user_id",
                table: "session",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
