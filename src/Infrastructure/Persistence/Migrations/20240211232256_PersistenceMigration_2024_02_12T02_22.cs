using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PersistenceMigration_2024_02_12T02_22 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "identities",
                columns: new[] { "id", "password", "title", "user_id", "username" },
                values: new object[] { 1L, "123", "Test1", 1L, "root" });

            migrationBuilder.InsertData(
                table: "proxies",
                columns: new[] { "id", "identity_id", "ip", "port", "title", "user_id" },
                values: new object[] { 1L, 1L, "123", 0, "Test1", 1L });

            migrationBuilder.CreateIndex(
                name: "ix_proxies_user_id",
                table: "proxies",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_identities_user_id",
                table: "identities",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_proxies_user_id",
                table: "proxies");

            migrationBuilder.DropIndex(
                name: "ix_identities_user_id",
                table: "identities");

            migrationBuilder.DeleteData(
                table: "proxies",
                keyColumn: "id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "identities",
                keyColumn: "id",
                keyValue: 1L);
        }
    }
}
