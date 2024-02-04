using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_02_04 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                table: "servers",
                newName: "title");

            migrationBuilder.RenameIndex(
                name: "ix_servers_name_user_id",
                table: "servers",
                newName: "ix_servers_title_user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "title",
                table: "servers",
                newName: "name");

            migrationBuilder.RenameIndex(
                name: "ix_servers_title_user_id",
                table: "servers",
                newName: "ix_servers_name_user_id");
        }
    }
}
